[![Gutter Grid logo](http://gutter-grid.net/assets/images/social-media.jpg)](http://gutter-grid.net)

    npm install gutter-grid --save

Gutter Grid is a flexbox based grid system for building fully responsive grid layouts with highly customisable gutters. Even though it is powered by flexbox, it features `display:table`, `float:left` and `display:inline-block` backups for legacy browsers to prevent your site from blowing up when viewed in IE8 and 9.

To read the full documentation go to http://gutter-grid.net

## New in version 2.0.0

  - Gutter Grid now comes in mixin flavour
  - Gutters can now have different vertical vs horizontal gutter widths
  - Improved legacy browser support
  - Reduced specificity on class based selectors for easier overriding of styles

## v2.0.0 breaking changes

### Reduced specificity in class names

If upgrading, none of the class names have changed, however the reduced specificity will mean that you may need to update your styles to not conflict with the new grid system.

### New format for assigning column break points

The new format to the column break points isn't much different to the original, it just has a colon in the middle of the 2 values now.

Version 1.x

`````
(
  600px 100%
)
`````

Version 2.x

`````
(
  600px: 100%
)
`````

### New format for assigning gutter break-points

The new way of assigning breakpoints to gutters isn't much different different to the original method. The only incompatible difference being that now you need to write `mq` with a space after it (the space is vital) before the list of values.

Version 1.x

`````scss
$grid-cell-gutters: (
    'mediaQueryGutter' : (
        50px,
        30px (max, 800px),
        10px (max, 700px)
    )
);
`````

Version 2.x

`````scss
$grid-cell-gutters: (
    'mediaQueryGutter' : mq (
        50px,
        30px (max, 800px),
        10px (max, 700px)
    )
);
`````
