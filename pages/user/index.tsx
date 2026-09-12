import { GetServerSideProps } from 'next'
import { getSession } from "next-auth/react"

const Profile: React.FC = () => {
  return (
    <div>
      <h1>Profile!</h1>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
