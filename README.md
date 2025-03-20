# SpeakNowTest

```bash
npm i 
ng serve
```

Port 4200, you know all this stuff

So, decisions I made:
1) Generated thumbnail image for each video instead of using video players, obviously
2) Signals... Good to have them everywhere.... but 
3) Structure. Well, this is very simple app, so using complicated architecture here is kinda dumb idea. But architecture I prefer in real life projects looks kinda like this:

```text
📂 src/
│── 📂 app/
│   │── 📂 core/
│   │   │── 📂 services/
│   │   │── 📂 guards/
│   │   │── 📂 interceptors/
│   │   └── core.module.ts <- modules could be, but not necessary
│   │── 📂 shared/
│   │   │── 📂 components/
│   │   │── 📂 directives/
│   │   │── 📂 pipes/
│   │   │── 📂 utils/
│   │   └── shared.module.ts
│   │── 📂 pages/
│   │   │── 📂 dashboard/
│   │   │   │── 📂 components/
│   │   │   │── dashboard.module.ts
│   │   │── 📂 settings/
│   │   │   │── 📂 components/
│   │   │   │── settings.module.ts
│   │── 📂 library/
│   │   │── 📂 some-ui-kit-or-whatever/
│   │   └── library.module.ts
│   │── 📂 store/
│   │   │── 📂 actions/
│   │   │── 📂 reducers/
│   │   │── 📂 selectors/
│   │── 📂 assets/
│   │── 📂 styles/
│   │── 📂 interfaces/
│   └── app.module.ts
```
4) Storage. IndexedDB --> good for big amount of data, obvious choice 
5) Modals. I made them by myself because I can, but I would use Angular Material in real life project. Alo there is two separate modals component, but better to have modal container and project content inside.
6) BandwidthService. Probably there is better way to do this.
7) ```<app-root-component/>``` inside app-component. frankly speaking I don`t know, this is just a habit. There is no many wisdom here, I just like to have app component for really global stuff.
8) Positions of injects not on the top, yes I know. This is just settings of IDE autoformatting. For now I don`t care about this. But in real project they probably should be at the top of the class
9) And tests. I mean, c`mon guys, this is just a test assignment, they are autogenereted. In real life I would to write test for some core functionality and complicated components at least.
