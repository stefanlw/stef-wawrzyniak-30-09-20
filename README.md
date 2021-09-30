# stefan-wawrzyniak-18-09-21

![CI](https://github.com/stefanlw/stefan-wawrzyniak-18-09-21/actions/workflows/main.yml/badge.svg)

<p align="center">
  <img width="250" src="https://github.com/stefanlw/stefan-wawrzyniak-18-09-21/blob/4b505daf232d1a692d743a4c80a81ed3224dc019/Screen_Recording.gif" />
</p>

## Project structure

I tend to organise files by domain/what they do rather than what they are. At the apps current size it may seem like a fair amount of overhead with folders containing one file but as the app grows (in my experince) it will scale better.

```
stefan-wawrzyniak-18-09-21/src/
    ├── components/ - reusable components
    |    └── [ComponentName]
    |         ├──  ComponentName.tsx - the component
    |         ├──  ComponentName.stories.tsx - storybook file
    |         ├──  index.ts
    |         └──  __tests__/ - Any tests specific to this component
    |             └── ComponentName.test.ts
    |
    ├── features/ - features/pages
    |    ├──  [FeatureName].tsx - the feature/page
    |    ├──  hooks/
    |    ├──  utils/ - should store any utils specific to this feature
    |    ├──  types/ - should store any types specific to this feature
    |    |    └── [domain].ts
    |    └──  __tests__/ - should store any types specific to this feature
    |         └── [FeatureName].test.tsx
    ├── storybook/ - storybook config (moved to root)
    |
    ├── common/ - anything shared throughout the app
    |
    ├── theme/ - shared styles
    |
    └── types - common TS types
         └──  [domain].ts
```

## Notes

### State management

I decided that using a state management library was unnecessary as keeping state contained in the Order book feature was enough to satisfy the task's requirements and keep complexity low.

### Testing

I've added unit tests to a few areas, if I had more time the coverage would be much better. In hindsight I should have tested the orderbook functionality first as they would have delivered the most value but I ran out of time to get round to them. I also setup [Loki](https://loki.js.org/) for visual regression tests on storybook to create a short feedback loop if other developers were to contribute to the project and make changes the UI/component library (although i struggled to get this running on my machine in the time available).

### Performance

I tested a development build of the app on a physical iPhone 11 pro and an iphone 8 simulator (not a perfect scenario) and neither dipped below ~58 ish fps even with a slightly faster `UPDATE_INTERVAL` set. In a real world scenario this would be a business decision but due to the contstraints of the test and not having access to users/user requirements I decided a delay of around 500ms between receiving a delta message and it surfacing in the UI was acceptable. With more time/in a production scenario I would test on more devices and introduce an automated process of measuring performance across devices so that a degredation in performance is surfaced in the CI pipeline with other developers contributing to the app. There are still areas of the orderbook that could be made more efficient but I don't think these would yield a perceivable performance increase that positively impacts UX so I have left them on the table now.

### Navigation + Order book focus handling

As the test requirements stated that other developers would work on the app in the future I added react navigation with some basic config and test coverage so the orderbook focus handling requirement would still be met in the event more screens are added.

### Changes i'd have made if i had more time

- Improved test coverage + test quality
- Investigated Loki config issue which meant I couldn't add visual regression tests (i think its my machine)
- Improved error handling
- Support for themes
- UI Design (Added an indicator of which contract is being displayed)
