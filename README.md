[![Gutter Grid logo](http://gutter-grid.net/assets/images/social-media.jpg)](http://gutter-grid.net)

``````
npm install gutter-grid --save
``````

## Why use [Gutter Grid](http://gutter-grid.net)?

### The problem

CSS Grid is now implemented in all modern browsers. All of our layout dreams have come true! ... Well almost all of them.

Unfortunately IE11 still holds a fairly significant market share and it doesn't support the modern implementation of CSS Grid. It can be difficult to get people on board with the idea of allowing IE to look different to modern browsers. That is especially the case if the site you are building is an intranet with a 90% IE user base.

[Autoprefixer](https://github.com/postcss/autoprefixer) is able to help out a lot in terms of getting IE11's version of CSS Grid to behave almost like modern browsers do. Unfortunately we are still stuck with IE11 not supporting CSS Grid auto-placement. That is a major pain point for this industry and Gutter Grid sets out to fix that.

### The solution

Gutter Grid is a flexbox based grid system for building fully responsive grid layouts with highly customisable gutters. These gutters are highly reminiscent of the CSS `grid-gap` property. So reminiscent in fact that that Gutter Grid gutters will line up perfectly with real CSS Grid gaps! Since this grid system is powered by flexbox and not CSS Grid, it works perfectly in IE11. Through Gutter Grid, IE11 has access to simple auto-placement grids with gaps (albeit with a different syntax). It even comes with a default set of media queries that may save you from having to write out some custom styles for mobile devices.

Even though Gutter Grid is powered by flexbox, it features a legacy mode that, when enabled, adds `display:table`, `float:left` and `display:inline-block` backups that legacy browsers can fall back on. This will help prevent your site from blowing up even when viewed in those decrepit old IE8 and 9 browsers!

**To read the full documentation go to http://gutter-grid.net.**

You can view the change log on the [GitHub releases page](https://github.com/Dan503/gutter-grid/releases) or the [Gutter Grid website](http://gutter-grid.net/pages/15-change-log/).