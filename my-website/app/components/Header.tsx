import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Header() {
	const getActiveClass = ({ isActive }: { isActive: boolean }) =>
		isActive ? "nav-link active" : "nav-link";

	const [show, setShow] = useState(true);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;
			if (currentY > lastScrollY.current && currentY > 64) {
				setShow(false); // 向下滚动隐藏
			} else {
				setShow(true); // 向上滚动显示
			}
			lastScrollY.current = currentY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<motion.header
			className='site-header'
			initial={{ y: 0 }}
			animate={{ y: show ? 0 : "-100%" }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
		>
			<div className='container'>
				<NavLink to='/' className='logo'>
					My&nbsp;Portfolio
				</NavLink>
				<nav className='nav-links'>
					<NavLink to='/' className={getActiveClass} end>
						Home
					</NavLink>
					<NavLink to='/about' className={getActiveClass}>
						About
					</NavLink>
					<NavLink to='/projects' className={getActiveClass}>
						Projects
					</NavLink>
					<NavLink to='/contact' className={getActiveClass}>
						Contact
					</NavLink>
				</nav>
				{/* Dark mode toggle placeholder */}
				<button className='theme-toggle' aria-label='Toggle dark mode'>
					🌓
				</button>
			</div>
		</motion.header>
	);
}
