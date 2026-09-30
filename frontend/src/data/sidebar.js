import { FaTh, FaRegChartBar, FaCommentAlt, FaQrcode, FaUserShield } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { MdAssessment } from "react-icons/md";

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Product",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Scan",
    icon: <FaQrcode />,
    path: "/scan",
  },
  {
    title: "Reports",
    icon: <MdAssessment />,
    path: "/reports",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
  {
    title: "Admin",
    icon: <FaUserShield />,
    path: "/admin",
    adminOnly: true,
  },
];

export default menu;