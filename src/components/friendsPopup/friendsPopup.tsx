import React, { useState, useEffect } from 'react'
import authService from 'components/apiDeclaration/apiDeclaration'
import styled from 'styled-components'
import ReactList from 'react-list'

export default function FriendsPopup(props: any) {
  const [searched, setSearched] = useState('')
  const {
    user,
    friends,
    displayedFriends,
    checkDisplayedFriend,
    addFriendMarker,
    addedFriends,
  } = props

  useEffect(() => {
    console.log(user)
    console.log(addedFriends)
  }, [displayedFriends])

  const handleCheck = (event: any) => {
    checkDisplayedFriend(event)
  }

  const handleAdd = (event: any) => {
    checkDisplayedFriend(event)
    console.log('test')
  }

  const Item = (index: any, key: any) => {
    console.log(friends[index].friendStatus)
    if (
      friends[index].locationPermission === 'NOT_ALLOWED' &&
      friends[index].friendStatus === 'INVITED_BY_ME' &&
      friends[index].friendStatus === 'INVITED_BY_HIM'
    )
      return <div></div>

    const selected = displayedFriends.find(
      (friend: any) => friend.username === friends[index].username,
    )
    console.log(selected)
    if (
      searched &&
      friends[index].friendStatus === 'FRIENDS' &&
      friends[index].locationPermission === 'ALLOWED'
    ) {
      if (
        friends[index].username.toLowerCase().includes(searched.toLowerCase())
      )
        return (
          <Friend
            username={friends[index].username}
            handleCheck={handleAdd}
            selected={selected}
            key={key}
          />
        )
      return <div></div>
    } else if (
      friends[index].friendStatus === 'FRIENDS' &&
      friends[index].locationPermission === 'ALLOWED'
    )
      return (
        <Friend
          username={friends[index].username}
          handleCheck={handleAdd}
          selected={selected}
          key={key}
        />
      )
    return <div></div>
  }

  return (
    <FriendsContainer>
      <FriendsInput
        value={searched}
        onChange={(e) => setSearched(e.target.value)}
      />
      <div
        style={{
          overflow: 'auto',
          maxHeight: 110,
          marginTop: 10,
        }}
      >
        <ReactList itemRenderer={Item} length={friends.length} />
      </div>
    </FriendsContainer>
  )
}

const Friend = (props: any) => {
  const { username, handleCheck, selected } = props
  return (
    <FriendTitle active={!!selected} onClick={() => handleCheck(username)}>
      {'@'}
      {username}
    </FriendTitle>
  )
}

type FriendsTitleProps = {
  active: boolean
}

const FriendsContainer = styled.div`
  height: 150px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: rgba(245, 255, 245, 0.9);
  border-radius: 10px;
`

const FriendsInput = styled.input`
  width: 80%;
  margin: 0 auto;
  font-size: 18px;
  background-color: rgba(245, 255, 245, 0.9);
  border-width: 0 0 2px 0;
  outline: none;

  :focus {
    border-color: #73b15b;
  }
`

const FriendTitle = styled.p<FriendsTitleProps>`
  width: 90%;
  font-size: 18px;
  color: #589441;
  line-height: 10px;
  padding: 5px;
  margin: 5px 0 5px 0;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid rgba(245, 255, 245, 0.9);
  background-color: ${(props) =>
    props.active ? '#c9ecbc' : 'rgba(245, 255, 245, 0.9)'};
  :hover {
    border: 1px solid #c9ecbc;
  }
`
