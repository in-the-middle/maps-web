import React, { useState, useEffect } from 'react'
import authService from 'components/apiDeclaration/apiDeclaration'
import styled from 'styled-components'
import ReactList from 'react-list'
import { LocationPermissionDTO } from '../../authServiceApi/model'

type OptionProps = {
  active: boolean
}

export default function FriendSettings(props: any) {
  const [friendsList, setFriendsList] = useState<any>(null)
  const [searched, setSearched] = useState('')
  const [activeSection, setActiveSection] = useState('friends')
  const [loaded, setLoaded] = useState(false)
  const [friendlistChanged, setfriendlistChanged] = useState(false)

  const { user, changeFriendsList } = props

  useEffect(() => {
    ;(async function () {
      try {
        const response = await authService.getFriendList({
          queryParams: {
            id: user.userId,
          },
        })
        setFriendsList(response)
        changeFriendsList(response)
        setLoaded(true)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [friendlistChanged])

  async function addFriend(username: any) {
    try {
      const request = {
        queryParams: {
          id: user.userId,
          friendUsername: username,
        },
      }
      const response = await authService.addFriend(request)
      setfriendlistChanged(!friendlistChanged)
    } catch (e) {
      console.log(e)
    }
  }

  async function deleteFriend(friendUsername: any) {
    try {
      const request = {
        queryParams: {
          id: user.userId,
          friendUsername: friendUsername,
        },
      }
      const response = await authService.deleteFriend(request)

      setfriendlistChanged(!friendlistChanged)
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  async function changeLocationPermission(
    id: string,
    locationPermission: LocationPermissionDTO,
    username: string,
  ) {
    try {
      const permission =
        locationPermission === 'ALLOWED'
          ? ('NOT_ALLOWED' as LocationPermissionDTO)
          : ('ALLOWED' as LocationPermissionDTO)
      const request = {
        queryParams: {
          id: id,
          friendUsername: username,
          locationPermission: permission,
        },
      }
      const response = await authService.changeLocationPermission(request)
      setfriendlistChanged(!friendlistChanged)
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  const FriendItem = (index: any, key: any) => {
    return friendsList[index] &&
      friendsList[index].friendStatus === 'FRIENDS' ? (
      <FriendComponent
        key={key}
        username={friendsList[index].username}
        locationPermission={friendsList[index].locationPermission}
        id={user.userId}
      />
    ) : (
      <div key={key}></div>
    )
  }

  const RequestItem = (index: any, key: any) => {
    return friendsList[index] &&
      friendsList[index].friendStatus === 'INVITED_BY_ME' ? (
      <RequestComponent key={key} username={friendsList[index].username} />
    ) : (
      <div key={key}></div>
    )
  }

  const ResponseItem = (index: any, key: any) => {
    return friendsList[index] &&
      friendsList[index].friendStatus === 'INVITED_BY_HIM' ? (
      <InvitationComponent key={key} username={friendsList[index].username} />
    ) : (
      <div key={key}></div>
    )
  }

  const FriendComponent = (props: any) => {
    const { username, locationPermission, id } = props
    return (
      <FriendsContainer>
        <FriendTitle>
          {'@'}
          {username}
        </FriendTitle>
        <ButtonContainer>
          <ShareLocationButton
            onClick={() =>
              changeLocationPermission(id, locationPermission, username)
            }
          >
            {locationPermission === 'ALLOWED' ? "don't share" : 'share'}
          </ShareLocationButton>
          <DeleteFriendButton onClick={() => deleteFriend(username)}>
            delete
          </DeleteFriendButton>
        </ButtonContainer>
      </FriendsContainer>
    )
  }

  const RequestComponent = (props: any) => {
    const { username } = props
    return (
      <RequestContainer>
        <RequestTitle>
          {'@'}
          {username}
        </RequestTitle>
        <DeleteFriendButton onClick={() => deleteFriend(username)}>
          delete
        </DeleteFriendButton>
      </RequestContainer>
    )
  }

  const InvitationComponent = (props: any) => {
    const { username } = props
    return (
      <FriendsContainer>
        <FriendTitle>
          {'@'}
          {username}
        </FriendTitle>
        <ButtonContainer>
          <ShareLocationButton onClick={() => addFriend(username)}>
            accept
          </ShareLocationButton>
          <DeleteFriendButton onClick={() => deleteFriend(username)}>
            decline
          </DeleteFriendButton>
        </ButtonContainer>
      </FriendsContainer>
    )
  }

  return (
    <div>
      <SelectContainer>
        <SelectOption
          active={activeSection === 'friends'}
          onClick={() => setActiveSection('friends')}
        >
          friends
        </SelectOption>
        <SelectOption
          active={activeSection === 'requests'}
          onClick={() => setActiveSection('requests')}
        >
          requests
        </SelectOption>
        <SelectOption
          active={activeSection === 'invitations'}
          onClick={() => setActiveSection('invitations')}
        >
          invitations
        </SelectOption>
      </SelectContainer>

      {activeSection === 'friends' ? (
        <div>
          <InputContainer>
            <FriendsInput
              value={searched}
              onChange={(e) => setSearched(e.target.value)}
              onSubmit={() => addFriend(searched)}
            />
            <AddButton onClick={() => addFriend(searched)}>Add</AddButton>
          </InputContainer>
          <ListContainer>
            {loaded ? (
              <ReactList
                itemRenderer={FriendItem}
                length={friendsList.length}
              />
            ) : (
              'Loading...'
            )}
          </ListContainer>
        </div>
      ) : activeSection === 'requests' ? (
        <ListContainer>
          {loaded ? (
            <ReactList itemRenderer={RequestItem} length={friendsList.length} />
          ) : (
            'Loading...'
          )}
        </ListContainer>
      ) : (
        <ListContainer>
          {loaded ? (
            <ReactList
              itemRenderer={ResponseItem}
              length={friendsList.length}
            />
          ) : (
            'Loading...'
          )}
        </ListContainer>
      )}
    </div>
  )
}

const FriendsInput = styled.input`
  flex: 0.7;
  margin: 0 auto;
  font-size: 18px;
  background-color: rgba(245, 255, 245, 0.9);
  border-width: 0 0 2px 0;
  outline: none;

  :focus {
    border-color: #73b15b;
  }
`

const InputContainer = styled.div`
  margin: 0 20px 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const AddButton = styled.button`
  flex: 0.3;
  background-color: green;
  color: #ffffff;
  border-radius: 5px;
  outline: none;
  background-color: #73b15b;
  border: 0px;
  font-weight: 500;
  font-size: 20px;

  :hover {
    background: #609c48;
    cursor: pointer;
  }
`

const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`

const SelectOption = styled.div<OptionProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0.33;
  height: 30px;
  border-radius: 6px;
  color: ${(props) => (props.active ? 'white' : 'black')};
  font-weight: 500;
  font-size: 20px;
  background-color: ${(props) =>
    props.active ? '#609c48' : 'rgba(245, 255, 245, 0.9)'};

  :hover {
    background: #609c48;
    cursor: pointer;
    color: white;
  }
`

const ListContainer = styled.div`
  margin: 10px;
  max-height: 110px;
  overflow: auto;
`

const FriendTitle = styled.p`
  flex: 0.45;
  font-size: 18px;
  color: #589441;
  line-height: 10px;
  padding: 5px;
  margin: 5px 0 5px 0;
  background-color: 'rgba(245, 255, 245, 0.9)';
`

const FriendsContainer = styled.div`
  border-bottom: 1px solid black;
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30px;
`

const RequestTitle = styled.p`
  flex: 0.3;
  font-size: 18px;
  color: #589441;
  line-height: 10px;
  padding: 5px;
  margin: 5px 0 5px 0;
  background-color: 'rgba(245, 255, 245, 0.9)';
`

const RequestContainer = styled.div`
  border-bottom: 1px solid black;
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30px;
`

const DeleteFriendButton = styled.button`
  font-size: 18px;
  color: #eb5160;
  border: 0px;
  background: rgba(245, 255, 245, 0.9);
  line-height: 10px;
  text-decoration: underline;

  :hover {
    cursor: pointer;
    color: #a83a45;
  }
`

const ShareLocationButton = styled.button`
  font-size: 18px;
  color: #01b0e8;
  border: 0px;
  background: rgba(245, 255, 245, 0.9);
  line-height: 10px;
  text-decoration: underline;

  :hover {
    cursor: pointer;
    color: #0097c9;
  }
`

const ButtonContainer = styled.div`
  flex: 0.55;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
