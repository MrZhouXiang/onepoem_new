<!-- 页面头部信息 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div class="navbar">
	<div class="navbar-inner">
		<div class="container-fluid">
			<ul class="nav pull-right">

				<li id="fat-menu" class="dropdown"><a href="#" id="drop3"
					role="button" class="dropdown-toggle" data-toggle="dropdown"> <i
						class="icon-user"></i> ${sessionScope.userSessionInfo.name} <i
						class="icon-caret-down"></i>
				</a>
					<ul class="dropdown-menu">
						<li><a tabindex="-1" href="/logout">退出</a></li>
					</ul></li>
			</ul>
			<a class="brand" href="index.jsp"><span class="first"></span>
				<span class="second">一首小诗</span></a>
		</div>
	</div>
</div>