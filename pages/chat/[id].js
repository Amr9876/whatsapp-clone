import styled from 'styled-components'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'
import { doc, collection, orderBy, query, getDocs, getDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../utils/getRecipientEmail'

export default function Chat({ chat, messages }){
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>

      <Sidebar />

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>

    </Container>      
  )
}

export async function getServerSideProps(context) {
  const chatsRef = collection(db, 'chats');
  const chatsDocRef = doc(chatsRef, context.query.id);

  const messagesRes = await getDocs(query(collection(chatsDocRef, 'messages'), orderBy('timestamp', 'asc')));

  const messages = messagesRes.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
  })).map(messages => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime()
  }));

  const chatRes = await getDoc(chatsDocRef);
  const chat = { 
      id: chatRes.id,
      ...chatRes.data()
  }

  console.log(chat, messages)

  return {
      props: {
          messages: JSON.stringify(messages),
          chat
      }
  }
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;