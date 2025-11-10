import React from 'react';
import Banner from '../../../components/User/Home/Banner';
import BannerImg from '../../../assets/images/banner.jpg';
import ProductList from '../../../components/User/Home/ProductList';
import FashionApproach from '../../../components/User/Home/FashionApproach';
import SummerCollection from '../../../components/User/Home/SummerCollection';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className='d-flex flex-column gap-5'>
            <Banner imageUrl={BannerImg}/>
            <ProductList/>
            <FashionApproach/>
            <SummerCollection/>
        </div>
    );
};

export default HomePage;