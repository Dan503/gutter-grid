[![Gutter Grid logo](http://gutter-grid.net/assets/images/social-media.jpg)](http://gutter-grid.net)

    npm install gutter-grid --save

Gutter Grid is a flexbox based grid system for building fully responsive grid layouts with highly customisable gutters. Even though it is powered by flexbox, it features `display:table` and `float:left` backups for legacy browsers to prevent your site from blowing up when viewed in IE8 and 9.

To read the full documentation go to http://gutter-grid.net

## New in version 2.0.0

  - Now comes in Sass mixin flavour
  - Improved legacy browser support
  - Reduced specificity on class based selectors for easier overriding of styles

## v2.0.0 breaking changes

  - Reduced specificity in class names
  - New format for assigning column break points

If upgrading, none of the class names have changed, however the reduced specificity will mean that you may need to update your styles to not conflict with the new grid system.

The new format to the column break points isn't much different to the original, it just has a colon in the middle of the 2 values now.

`````
(
//*2 column grid*/
  600px: 100%
)
`````

instead of

`````
(
//*2 column grid*/
  600px 100%
)
`````
