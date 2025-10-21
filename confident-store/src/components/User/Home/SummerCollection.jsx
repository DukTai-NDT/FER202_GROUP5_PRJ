import React from "react";
import { Container } from "react-bootstrap";
import LeftImage from "../../../assets/images/imgleft.webp"; // Thay bằng ảnh của bạn
import RightImage from "../../../assets/images/imgright.webp"; // Thay bằng ảnh của bạn

const SummerCollection = () => {
  return (
    <Container fluid className="p-0">
      <div style={styles.container}>
        {/* Left Image Section */}
        <div style={{ ...styles.imageSection, backgroundImage: `url(${LeftImage})` }}>
          <div style={styles.textLeft}>
            <ul style={styles.menu}>
              <li>ФУТБОЛКИ</li>
              <li>ХУДИ</li>
              <li>ЗИМ ХУДИ</li>
              <li>СВИТШОТЫ</li>
              <li>БОМБЕРЫ</li>
              <li>ВЕТРОВКИ</li>
              <li>АФРОКАЖ</li>
            </ul>
          </div>
        </div>

        {/* Right Image Section */}
        <div style={{ ...styles.imageSection, backgroundImage: `url(${RightImage})` }}>
          <div style={styles.textRight}>
            <ul style={styles.menu}>
              <li>ДЕКОРАТИВ</li>
              <li>ЦВЕТА</li>
              <li>ТКАНИ</li>
              <li>НОСКИ</li>
              <li>БУМАЖКИ</li>
            </ul>
          </div>
        </div>

        {/* Center Text */}
        <div style={styles.centerText}>
          <h2>ЛЕТНЯЯ КОЛЛЕКЦИЯ</h2>
          <p>2023</p>
        </div>
      </div>
    </Container>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    position: "relative",
    width: "100%",
    height: "600px",
  },
  imageSection: {
    flex: 1,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  textLeft: {
    position: "absolute",
    top: "10%",
    left: "10%",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
  },
  textRight: {
    position: "absolute",
    top: "10%",
    right: "10%",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "right",
  },
  centerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    lineHeight: "1.8",
  },
};

export default SummerCollection;
