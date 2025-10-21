import React from 'react';
import Banner from '../../../components/User/Home/Banner';
import BannerImg from '../../../assets/images/banner.jpg';
import ProductList from '../../../components/User/Home/ProductList';
import FashionApproach from '../../../components/User/Home/FashionApproach';
import SummerCollection from '../../../components/User/Home/SummerCollection';
const HomePage = () => {
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