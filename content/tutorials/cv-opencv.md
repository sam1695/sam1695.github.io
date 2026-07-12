# Computer Vision in Robotics: Object Tracking

Computer vision allows robots to understand their environments visually. This tutorial shows how to build a real-time object tracker using Python and **OpenCV** to track colored markers (like red balloons or green balls) which can then be picked up by a robotic manipulator.

---

## 1. Color Representation: RGB vs HSV

While digital displays use the **RGB** (Red, Green, Blue) color space, it is highly sensitive to lighting changes and shadows. For robust color tracking, we use **HSV** (Hue, Saturation, Value):

- **Hue (H)**: The color type (0 to 180 degrees in OpenCV). This is largely independent of lighting levels!
- **Saturation (S)**: The purity or intensity of the color (0 to 255).
- **Value (V)**: The brightness of the color (0 to 255).

```
          HSV Color Cone
             \     /
              \Hue/
               \ /
           Saturation --->
                |
                v Value (Brightness)
```

---

## 2. Tracking Algorithm Workflow

The tracking script performs the following frame-by-frame pipeline:

1. Capture video frame from the camera feed.
2. Convert the image from BGR to HSV color space.
3. Define threshold limits (low/high) for the target color.
4. Create a binary mask (pixels in range are white, others are black).
5. Apply morphology filtering (erosion and dilation) to remove noise.
6. Calculate the center of the largest contour to track the object coordinate.

---

## 3. Python Implementation

Make sure you have OpenCV installed:
```bash
pip install opencv-python numpy
```

Here is the tracking script `tracker.py`:

```python
import cv2
import numpy as np

# Initialize web camera feed
cap = cv2.VideoCapture(0)

# Define HSV boundaries for green color tracking
lower_green = np.array([35, 60, 60])
upper_green = np.array([85, 255, 255])

while True:
    ret, frame = cap.read()
    if not ret:
        break
        
    # Step 1: Smooth the image to reduce noise
    blurred = cv2.GaussianBlur(frame, (11, 11), 0)
    
    # Step 2: Convert BGR to HSV
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    
    # Step 3: Threshold the HSV image to keep only green
    mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Step 4: Perform erosion/dilation to clean up the binary mask
    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)
    
    # Step 5: Find outlines (contours) of green shapes
    contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    center = None
    
    # If we found at least one contour
    if len(contours) > 0:
        # Find the largest contour by area
        c = max(contours, key=cv2.contourArea)
        ((x, y), radius) = cv2.minEnclosingCircle(c)
        
        # Only draw and track if the size is reasonable
        if radius > 10:
            # Calculate moments to get exact centroid
            M = cv2.moments(c)
            center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))
            
            # Draw tracking circle and dot on the image
            cv2.circle(frame, (int(x), int(y)), int(radius), (0, 255, 255), 2)
            cv2.circle(frame, center, 5, (0, 0, 255), -1)
            
            # Output coordinates to terminal
            print(f"Tracking coordinates: X={center[0]}, Y={center[1]}")
            
    # Display the output frames
    cv2.imshow("Tracking Frame", frame)
    cv2.imshow("Mask Frame", mask)
    
    # Break loop on 'q' press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Clean up resources
cap.release()
cv2.destroyAllWindows()
```

---

## 4. Connecting to Robotic Arms

To guide a robotic arm using these camera coordinates, you must execute a **Camera-to-Robot Calibration**. 

This maps camera pixels $(u, v)$ to robot workspace coordinates $(X_R, Y_R)$. This is typically solved using affine transformations or homography matrix estimation:

$$\begin{bmatrix} X_R \\ Y_R \\ 1 \end{bmatrix} = H \begin{bmatrix} u \\ v \\ 1 \end{bmatrix}$$

We will cover eye-in-hand vs eye-to-hand calibration matrices in our next lab tutorial!
