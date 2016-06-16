<!-- 底部版权信息 -->
<%@page import="java.io.PrintWriter"%>
<%@page import="com.puyun.myshop.base.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String name = "xxxx有限公司";
    String str = "<div id=\"footer\"><p> <br></p></div>";
    PrintWriter out2 = response.getWriter();
    out2.print(str);
%>
