
import React, { useRef } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native'

import useUpdateEffect from "react-use/lib/useUpdateEffect"
import usePrevious from "react-use/lib/usePrevious"
import useUpdate from "react-use/lib/useUpdate"

const styles = StyleSheet.create({
  cover: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    zIndex: 1,
  },
  menu: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  menuLeft: {
    left: 0,
  },
  menuRight: {
    right: 0,
  },
})

const useNativeDriver = Platform.OS !== 'web'

const SideMenu = ({
  open=false,
  onClose=() => {},
  children=null,
  
  menuWidth=280,
  menuPosition='left',
  coverBackgroundColor,
  duration=250,
  onOpenAnimationComplete=() => {},
  onCloseAnimationComplete=() => {},
}) => {

  const animated = useRef(new Animated.Value(open ? 1 : 0)).current
  const prevOpen = usePrevious(open)
  const update = useUpdate() 

  useUpdateEffect(
    () => {
      if(open) {
        Animated.timing(
          animated, 
          {
            toValue: 1,
            duration,
            useNativeDriver,
          },
        ).start(onOpenAnimationComplete)

      } else {
        Animated.timing(
          animated, 
          {
            toValue: 0,
            duration,
            useNativeDriver,
          },
        ).start(() => {
          update()
          onCloseAnimationComplete()
        })
      }
    },
    [ open ]
  )

  return (
    <>
      {!!(open || prevOpen) &&
        <TouchableWithoutFeedback
          onPress={open ? onClose : null}
        >
          <Animated.View
            style={[
              styles.cover,
              (!coverBackgroundColor ? null : {
                backgroundColor: coverBackgroundColor,
              }),
              {
                opacity: animated,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      }
      <Animated.View
        style={[
          styles.menu,
          (menuPosition === 'right' ? styles.menuRight : styles.menuLeft),
          {
            width: menuWidth,
            transform: [{
              translateX: animated.interpolate({
                inputRange: [0, 1],
                outputRange: (
                  menuPosition === 'right'
                    ? [menuWidth, 0]
                    : [menuWidth * -1, 0]
                ),
              }),
            }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </>
  )

}

export default SideMenu