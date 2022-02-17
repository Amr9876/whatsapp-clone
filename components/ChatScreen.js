import styled from 'styled-components'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import { Avatar, IconButton } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { collection, doc, query, orderBy, setDoc, serverTimestamp, addDoc, where } from 'firebase/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { useRef, useState } from 'react'
import Message from './Message';
import getRecipientEmail from './../utils/getRecipientEmail';
import TimeAgo from 'timeago-react'

export default function ChatScreen({ chat, messages }) { 
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const router = useRouter();
  const [messagesSnapshot] = useCollection(query(collection(doc(collection(db, 'chats'), router.query.id), 'messages'), orderBy('timestamp', 'asc')))
  const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where('email', '==', getRecipientEmail(chat.users, user))));
  const endOfMessageRef = useRef(null);

  const showMessages = () => {
    if(messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
          <Message key={message.id} user={message.data().user} message={{ ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }} />
      ))
    } else {
        return JSON.parse(messages).map(message => (
          <Message key={message.id} user={message.user} message={message} />
        ))
    }
  }

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const sendMessage = (e) => {
    e.preventDefault();

    const usersDocRef = doc(collection(db, 'users'), user.uid);
    const messagesRef = collection(doc(collection(db, 'chats'),router.query.id), 'messages');



    setDoc(usersDocRef, { lastSeen: serverTimestamp() }, { merge: true })
    addDoc(messagesRef, { timestamp: serverTimestamp(), message: input, user: user.email, photoURL: user.photoURL });

    setInput('');
    scrollToBottom();
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
            <h3>{recipientEmail}</h3>

            {recipientSnapshot ? (
                <p>Last Active: {' '}
                  {recipient?.lastSeen?.toDate() ? (
                      <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                  ) : 'Unavailable'}
                </p>
            ) : (
                <p>Loading Last active...</p>
            )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />            
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input placeholder='' value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}


const Container = styled.div``;

const Header = styled.div`
  display: flex;
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const HeaderIcons = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
`;