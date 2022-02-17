import styled from 'styled-components'
import { Avatar, IconButton, Button } from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from 'email-validator';
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, addDoc, query, where } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat'

export default function Sidebar() {
 
  const [user] = useAuthState(auth);
  const userChatRef = query(collection(db, 'chats'), where('users', 'array-contains', user.email));
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt('Please enter an email address for the user you wish to chat with!');
        
    if (!input) return null;
        
    if(EmailValidator.validate(input) && !chatExists(input) && input !== user.email){
      const chatsRef = collection(db, 'chats');
      
      addDoc(chatsRef, { users: [user.email, input] })
    }   
  }

  const chatExists = (recipientEmail) => !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => signOut(auth)} />

        <IconsContainer>
            <IconButton>
                <ChatIcon />
            </IconButton>
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        </IconsContainer>
      </Header>
   
      <Search>
        <SearchIcon />
        <SearchInput placeholder='Search In Chats' /> 
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {chatsSnapshot?.docs.map(chat => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  flex: 0.45;
  border-radius: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
 
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;  
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid #f5f5f5;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
      opacity: 0.8;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const IconsContainer = styled.div``;