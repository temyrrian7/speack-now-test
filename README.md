# SpeakNowTest

```bash
npm i 
ng serve
```

Port 4200, you know all this stuff

So, decisions I made:
1) generated thumbnail image for each video instead of using the video players, obviously
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
