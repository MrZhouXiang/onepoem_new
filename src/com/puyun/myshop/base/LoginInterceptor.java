package com.puyun.myshop.base;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.iuvei.framework.util.StringUtils;

public class LoginInterceptor extends HandlerInterceptorAdapter{
	private List<String> excludeURIs;
	private List<String> pageRequestURIs;
	
	public List<String> getExcludeURIs() {
		return excludeURIs;
	}

	public void setExcludeURIs(List<String> excludeURIs) {
		this.excludeURIs = excludeURIs;
	}

	public List<String> getPageRequestURIs() {
		return pageRequestURIs;
	}

	public void setPageRequestURIs(List<String> pageRequestURIs) {
		this.pageRequestURIs = pageRequestURIs;
	}
	/**
	 * 登录拦截，如果用户已经退出或者session已经过期，则不能继续访问服务器，提示session过期或转到登录界面
	 */
	@Override
	public boolean preHandle(HttpServletRequest request,HttpServletResponse response, Object handler) throws Exception {
 		String requestURI = request.getServletPath();
        String token = request.getParameter("token");

		if(StringUtils.isBlank(requestURI)){
			return super.preHandle(request, response, handler);
		}

        if(token != null) {
            return super.preHandle(request, response, handler);
        }
		/** excludeURIs里的地址是不拦截的 */
		if(excludeURIs!=null && !excludeURIs.isEmpty()){
			for(String url : excludeURIs){
                boolean bool = requestURI.contains(url);
				if(bool)
					return super.preHandle(request, response, handler);
			}
		}
		if(checkLogin(request)){/** 已经登录*/
			
			return super.preHandle(request, response, handler);
		}else{
			/** 未登录或登录超时 */
			/* 如果是页面请求，直接跳转到登录页面 */
			String loginUrl = request.getContextPath();
			if(pageRequestURIs!=null && !pageRequestURIs.isEmpty()){
				for(String url : pageRequestURIs){
					if(requestURI.contains(url)){
						loginUrl += "/home";
						response.sendRedirect(loginUrl);
						return false;
					}
				}
			}
			
			//判断是否为ajax请求  
		    if (request.getHeader("x-requested-with") != null && request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")) {  
		    	
		    	response.setCharacterEncoding("UTF-8");  
		    	response.addHeader("sessionstatus", "timeout");  
		    	response.addHeader("loginPath","/home");
		    	
				response.sendError(HttpStatus.UNAUTHORIZED.value(),"您已经太长时间没有操作,请刷新页面");  
		    	
		    }	 
			/* 剩下的是json请求，返回json格式的数据 */
//			response.setContentType("application/json;charset=UTF-8");
//			response.setCharacterEncoding("UTF-8");
//			PrintWriter writer = response.getWriter();
//			writer.print("{\"notLogin\":true}");
//			writer.close();
			return false;
		}
	}
	
	/**
	 * 判断用户是否登录。
	 * @param request
	 * @return 未登录或者session失效，返回false，否则返回true。
	 */
	private boolean checkLogin(HttpServletRequest request){
		HttpSession s = request.getSession();
		Object user = s.getAttribute(Constants.USER_INFO_SESSION);
		if(user != null){
			return true;
		}
		return false;
	}
}
