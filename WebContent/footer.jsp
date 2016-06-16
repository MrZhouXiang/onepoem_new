<!-- 底部版权信息 -->
<%@page import="java.io.PrintWriter"%>
<%@page import="com.puyun.myshop.base.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String name = "xxxx有限公司";
    String str = "<div id=\"footer\"><p> <br>苏ICP备13017784号-1 | 联系方式：025-86780888 | 公司地址：南京市栖霞区元化路8号南大科学园6-C-4<br> Copyright©2014 " + name + " 版权所有</p></div>";
    PrintWriter out2 = response.getWriter();
    out2.print(str);
%>
