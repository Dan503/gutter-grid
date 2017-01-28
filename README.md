[![Gutter Grid logo](http://gutter-grid.net/assets/images/social-media.jpg)](http://gutter-grid.net)

    npm install gutter-grid --save

Gutter Grid is a flexbox based grid system for building fully responsive grid layouts with highly customisable gutters. Even though it is powered by flexbox, it features `display:table` and `float:left` backups for legacy browsers to prevent your site from blowing up when viewed in IE8 and 9.

To read the full documentation go to http://gutter-grid.net

## New in version 2.0.0

  - Now comes in Sass mixin flavour
  - Improved legacy browser support
  - Reduced specificity on class based selectors for easier overriding of styles

If upgrading, none of the class names have changed, however the reduced specificity will mean that you may need to update your styles to not conflict with the grid system.