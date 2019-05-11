# ThemeSwitch

Like having a light theme on the day and a dark one in the night?

If the answer is yes, you know how annoying it can be to care about switchung color themes on a daily basis.
This extension eliminates this extensive, manual theme switching and automatically applies different themes per day.

## Settings

This extension is mainly configured through the configuration key `themeswitch.directives`.

This key contains a list of so-called **switch directives**. A switch directive is the combination of a
time of day and a color theme name. ThemeSwitch will then activate the specified theme when the point of time occurs.

In the config a **switch directive** is a object containing two keys:

* `time`: Time in HH:MM format (24h)
* `theme`: Name of the theme to activate

### Example

```javascript
"themeswitch.directives": [
    {
        "time": "19:00",
        "theme": "Dark (Visual Studio)"
    },
    {
        "time": "07:00",
        "theme": "Light (Visual Studio)"
    }
]
```

This configuration will activate the dark theme from 19:00 in the evening till 7:00 in the morning.
From 7:00 to 19:00 the light theme will be applied.

## Release Notes

### 0.1.0

Basic Implementation