import * as React from 'react'
import './generic.less'
import { IColorInfo } from './../../config/color'
import { NameSpaceStore } from './../../store/types'
import { IStore } from './../../store/types'
import Constance from './../../config/constance'

export interface GenericProps {
  className?: string;
  store?: IStore;
  color?: NameSpaceStore.IColorModel;
  prefixClass?: string;
}

export interface GenericState {}

export default class GenericComponent<P, S> extends React.Component<P, S> {
  props: P & GenericProps & { children?: any };
  state: S & GenericState;

  componentDidMount () {
    console.log('this.props', this.props)
  }

  static defaultProps = {
    prefixClass: Constance.PROJECT_NAME,
    className: `generic-component ${Constance.PROJECT_NAME}`
  }
}
