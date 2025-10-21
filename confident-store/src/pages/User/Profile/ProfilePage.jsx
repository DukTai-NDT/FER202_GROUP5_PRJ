import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileUpdateModal from "../../../components/User/Profile/UpdateProfile";
import { useState } from "react";
import { updateUserProfile } from "../../../services/userService";

const ProfilePage = () => {
    const navigate = useNavigate();

    // Assuming that user info is stored in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const navigateToEditProfile = () => setShowModal(true); // Trigger modal to open
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }
    return (
        <Container className="my-5" style={styles.profileContainer}>
            <Row>
                {/* Profile Image */}
                <Col md={4} style={styles.profileImageContainer}>
                    <img
                        src={"https://avatarfiles.alphacoders.com/181/181646.jpg" || "default-profile.jpg"} // Replace with your actual image URL
                        alt="User Profile"
                        style={styles.profileImage}
                    />
                </Col>

                {/* User Info */}
                <Col md={8} style={styles.infoContainer}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "6%" }}>
                        <h1 style={{ textAlign: "start", fontStyle: "italic" }}>My Profile</h1>
                        <Button
                            variant="warning"
                            onClick={navigateToEditProfile}
                        >
                            Edit Profile
                        </Button>
                    </div>


                    <h2 style={styles.name}>{user.fullName}</h2>
                    <h4 style={styles.title}>I'm a {user.role || "CEO / Lead Designer"}</h4>
                    <p style={styles.bio}>{user.bio || "Short bio or description about the user."}</p>

                    <div style={styles.infoDetails}>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                    </div>

                    {/* Social Media Icons */}
                    {/* <div style={styles.socialIcons}>
                        <a
                            href={`https://twitter.com/${user.social?.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaTwitter size={30} style={styles.socialIcon} />
                        </a>
                        <a
                            href={`https://instagram.com/${user.social?.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram size={30} style={styles.socialIcon} />
                        </a>
                        <a
                            href={`https://linkedin.com/in/${user.social?.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedin size={30} style={styles.socialIcon} />
                        </a>
                    </div> */}
                    <div>
                        <Button
                            variant="danger"
                            onClick={handleLogout}
                            style={styles.logout}
                        >
                            Logout
                        </Button>
                    </div>

                </Col>

                <ProfileUpdateModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    user={user}
                    updateUserProfile={updateUserProfile} // Pass the update function
                    setMessage={setMessage} // Pass the setMessage to show success/error
                />
            </Row>
        </Container>
    );
};

const styles = {
    profileContainer: {
        backgroundColor: "#121212", // Dark background color
        color: "#fff", // Light text color
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
    profileImageContainer: {
        display: "flex",
        justifyContent: "center",
    },
    profileImage: {
        width: "100%", // Make the profile image larger
        height: "50vh", // Same height to make it a square
        objectFit: "cover",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
    infoContainer: {
        paddingLeft: "30px", // Add some space between the image and text
    },
    name: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "#f1c40f", // Gold color for name
    },
    title: {
        fontSize: "20px",
        fontWeight: "300",
        color: "#fff",
        marginBottom: "15px",
    },
    bio: {
        fontSize: "16px",
        color: "#ddd",
        lineHeight: "1.6",
        marginBottom: "20px",
    },
    infoDetails: {
        marginTop: "20px",
        fontSize: "16px",
        color: "#fff",
        lineHeight: "1.6",
    },
    socialIcons: {
        marginTop: "20px",
    },
    socialIcon: {
        margin: "0 15px",
        color: "#fff",
        cursor: "pointer",
        transition: "color 0.3s",
    },
};

export default ProfilePage;
