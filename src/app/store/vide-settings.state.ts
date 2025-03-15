import { State, Action, StateContext, Selector } from '@ngxs/store';

export class SetVideoQuality {
  static readonly type = '[Video] Set Quality';
  constructor(public quality: 'low' | 'medium' | 'high') {}
}

export interface VideoSettingsStateModel {
  quality: 'low' | 'medium' | 'high';
}

@State<VideoSettingsStateModel>({
  name: 'videoSettings',
  defaults: {
    quality: 'medium',
  },
})
export class VideoSettingsState {
  @Selector()
  static quality(state: VideoSettingsStateModel) {
    return state.quality;
  }

  @Action(SetVideoQuality)
  setQuality(ctx: StateContext<VideoSettingsStateModel>, action: SetVideoQuality) {
    ctx.patchState({ quality: action.quality });
  }
}
