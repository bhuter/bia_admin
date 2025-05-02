import PersonalDetails from "@/app/comps/agents/profile/personalDetails";
import ProfileBar from "@/app/comps/agents/profile/profileBar";

const Profile = () => {
    return(
    <>
      <head>
        <title>Profile</title>
      </head>
      <div className="flex flex-col sm:flex-row">
          <ProfileBar />
          <PersonalDetails />
      </div>
      </>
    );
}
export default Profile;