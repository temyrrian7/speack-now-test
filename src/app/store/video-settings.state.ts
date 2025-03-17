import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Quality } from '../interfaces/quality.enum';

export class SetVideoQuality {
  static readonly type = '[Video] Set Quality';
  constructor(public quality: Quality) {}
}

export interface VideoSettingsStateModel {
  quality: Quality;
}

@State<VideoSettingsStateModel>({
  name: 'videoSettings',
  defaults: {
    quality: Quality.MEDIUM,
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
