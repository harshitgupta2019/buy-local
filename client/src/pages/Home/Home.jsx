import React from 'react'
import './Home.css'
import one from '../../assests/carousal0.png'
const Home = () => {
  return (	
	<div>
		<section id="banner" >

			<div class="inner">
				<h1><span>Connecting Locals peoples</span></h1>
				<img src={one} height={500} width={1200}/>
			</div>
		</section>
		<section id="about">
			<div class="inner">
				<header>
					<h2>About<br/><br/></h2>
				</header>
				<p><b>Time Saving Groceries</b></p>
				<p>It provides a platform where customers can connect to their local shops. It aims at increasing the interaction between customers and shops in their locality by helping customers book their number on the shop they want to visit. The online booking system saves the customers, increases the sales in shops, and also helps in maintaining social distancing. Customers can also show their support to small businesses by donating them some funds.</p>
				<br/><p><b>FEATURES-</b></p>
				<p><ul><span class="fa fa-hand-o-right"></span> <b>Support small Biz:</b> It provides an easy-to-use interface to see local small businesses and donate some money to them if they need financial help</ul></p>
				<p><ul><span class="fa fa-hand-o-right"></span> <b>Book your number:</b> Customers can reserve their slot online at any shop they want to visit, they will be provided with a token number and they will be notified the time they should visit that shop.</ul></p>
				<p><ul><span class="fa fa-hand-o-right"></span> <b>Advertise your product/service/offer:</b> This app provides a column where business owners can share a post advertising their products, services, offers.</ul></p>
			</div>
		</section>
		<section id="addshop">
			<div class="inner">

				<article>
					<div class="content">
						<header>
							<h2>Add Shop<br/><br/></h2>
							<p>To avail all the features offered to shops, shop owner must-</p>
						</header>

						<span class="icon fa-user-circle"></span>
						<header>
							<h3>Step-1</h3>
						</header>
						<p>Login/Register on website </p>
						<ul class="actions">
							<li><a href="/formlogin" class="button alt">Login/Register</a></li>
						</ul>
					</div>
				</article>
				<article>
					<div class="content">
						<header>
							<h2></h2>
						</header>
						<span class="icon fa-id-card-o"></span>
						<header>
							<h3>Step-2</h3>
						</header>
						<p>If your shop/startup/business is not registered under Ministry of micro, small and medium enterprises (MSME) or Shops and Establishment act, then first register there</p>
						<ul class="actions">
							<li><a href="http://my.msme.gov.in/MyMsme/Reg/Home.aspx" class="button alt">MSME </a></li>
						</ul>
					</div>
				</article>
				<article>
				<div class="content">
						<header>
							<h2></h2>
						</header>
						<span class="icon fa-handshake-o"></span>
						<header>
							<h3>Step-3</h3>
						</header>
						<p>Fill required details in the form to register your shop/startup/business on 5-&-DIME</p>
						<ul class="actions">
						</ul>
					</div>
				</article>
			</div>
		</section>
	</div>
  )
}

export default Home
