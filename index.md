---
layout: default
title: Home
---

{% include nav.html %}

# Welcome to Sam1695 Robotics

Tutorials, guides, and videos to help newcomers get up to speed in the lab — starting with the Unitree G1 and going from there.

New here? Check out the [About page](/about) for where to start.

## Latest Posts

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <br>
    <small>{{ post.date | date: "%B %-d, %Y" }}</small>
  </li>
{% endfor %}
</ul>
