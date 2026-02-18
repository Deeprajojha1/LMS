import React from 'react'
import { MdOutlineCastForEducation } from "react-icons/md";
import './Logo.css'
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const Logo = () => {
  return (
    <div className='logo'> 
    <div> <MdOutlineCastForEducation /> 20K+ Online Courses</div>
    <div> <SiOpenaccess /> Lifetime Access</div>
    <div> <FaSackDollar />Value for money</div>
    <div><FaUsers /> Community Support</div>
    <div> <BiSupport /> Lifetime Support</div>
    </div>
  )
}

export default Logo