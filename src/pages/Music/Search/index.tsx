import React, { useRef, useLayoutEffect, useState, useMemo, useCallback, useEffect } from 'react'
import className from 'classnames'
import { PROJECT_NAME, MUSIC_SEARCH_DEFAULT_LISMIT } from '../../../config/constance'
import './search.less'
import MusicListGroup from './../../../components/MusicListGroup'
import { isEmptyStr } from 'd-utils/lib/expUtils/index'
import LoadingTips from '../../../components/LoadingTips';
import * as MusicFetch from './../action'
import * as UrlUtils from 'd-utils/lib/urlUtils'
import { useScroll } from './../../../utils/use'

interface MusicSearchProps {
  history: any;
}

const MusicSearch = (props: MusicSearchProps) => {
  const searchInput: any = useRef(null)
  const searchGroup: any = useRef(null)

  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [searchLists, setSearchList] = useState([])

  const [keywords, setKeywords] = useState(UrlUtils.parseUrl(decodeURIComponent(location.href)).keywords)
  
  const [loadingText, setLoadingText] = useState('搜索中...')

  const loadMoreInfo = () => {
    console.log('loading', loading)
    if (loading) return
    setOffset((offset) => offset = offset + MUSIC_SEARCH_DEFAULT_LISMIT)
  }

  useLayoutEffect(() => {
    searchInput.current.focus()
  }, [searchInput])

  useScroll(searchGroup, loadMoreInfo)

  useEffect(() => {
    if (hasSearchList) {
      getSearchLists()
    } else {
      getSearchLists(true)
    }
  }, [keywords, offset])

  const hasSearchList = useMemo(() => {
    return searchLists.length > 0
  }, [searchLists])

  const handleSearch = (async (e: any) => {
    const event = e || window.event
    var code = event.keyCode || event.which || event.charCode
    if (code === 13) {
      const words = searchInput.current.value
      console.log(props.history)
      setKeywords((keywords: any) => keywords = words)
      props.history.replace(`/music/search?keywords=${words}`)
    }
  })

  const showLoadingTipsFn = (text: string = '加载中') => {
    setLoading((loading) => loading = true)
    setLoadingText((loadingText) => loadingText = text)
  }

  const hideLoadingTipsFn = () => {
    setLoading((loading) => loading = false)
  }

  const getSearchLists = useCallback(async (isSearch = false) => {
    const keywords = searchInput.current.value
    if (isEmptyStr(keywords)) {
      return
    }

    // 搜索新的数据会清除之前的数据
    if (isSearch) {
      setSearchList((searchLists) => searchLists = [])
    }

    showLoadingTipsFn()
    const res: any = await MusicFetch.getSearchLists(keywords, offset)
    const loadLists = Array.isArray(res.result.songs) ? res.result.songs : []
    setSearchList((searchLists) => searchLists = searchLists.concat(loadLists))
    // 搜索之后为空的时候判断是否是没有数据 且是否是第一次搜索
    if (isSearch && loadLists.length === 0) {
      showLoadingTipsFn(`未能搜索到关于 '${keywords}' 相关的各歌曲`)
      return
    }
    hideLoadingTipsFn()
  }, [offset])

  // if (searchGroup && searchGroup.current) {
  //   useScroll(searchGroup.current, loadMoreInfo)
  // }

  const classString = className({
    [`${PROJECT_NAME}-music-search`]: true,
    [`input-active`]: keywords || hasSearchList
  })

  const classSearchGroup = className({
    [`${PROJECT_NAME}-music-search-group`]: true,
    [`show`]: hasSearchList
  })

  return(
    <section className={classString}>
      <div className={`${PROJECT_NAME}-music-search-entry`}>
        <input className={`${PROJECT_NAME}-music-search-entry-input`} 
                type="text"
                defaultValue={keywords}
                placeholder="想听的音乐？"
                onKeyDown={handleSearch}
                ref={searchInput}/>
      </div>
      <div className={classSearchGroup}
           ref={searchGroup}>
        <MusicListGroup lists={searchLists}/>
        <LoadingTips show={loading} text={loadingText}/>
      </div>
    </section>
  )
}

export default MusicSearch
