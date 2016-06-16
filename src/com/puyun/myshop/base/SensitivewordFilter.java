package com.puyun.myshop.base;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

/**
 * 敏感词过滤
 * 
 * @author dxm
 * 
 */
@SuppressWarnings("rawtypes")
public class SensitivewordFilter implements Filter{

	private static Map sensitiveWordMap = null;

	// 最小匹配规则
	public static int minMatchTYpe = 1;

	// 最大匹配规则
	public static int maxMatchType = 2;

	// 单例
	private static SensitivewordFilter inst = null;

	/**
	 * 构造函数，初始化敏感词库
	 */
	public SensitivewordFilter() {
		sensitiveWordMap = new SensitiveWordInit().initKeyWord();
	}

	/**
	 * 获取单例
	 * 
	 * @return
	 */
	public static SensitivewordFilter getInstance() {
		if (null == inst) {
			inst = new SensitivewordFilter();
		}
		return inst;
	}

	/**
	 * 判断文字是否包含敏感字符
	 * 
	 * @param txt
	 * @param matchType
	 * @return
	 */
	public boolean isContaintSensitiveWord(String txt, int matchType) {
		boolean flag = false;
		for (int i = 0; i < txt.length(); i++) {

			// 判断是否包含敏感字符
			int matchFlag = this.CheckSensitiveWord(txt, i, matchType);

			// 大于0存在，返回true
			if (matchFlag > 0) {
				flag = true;
			}
		}
		return flag;
	}

	/**
	 * 获取文字中的敏感词
	 * 
	 * @param txt
	 * @param matchType
	 * @return
	 */
	public Set<String> getSensitiveWord(String txt, int matchType) {
		Set<String> sensitiveWordList = new HashSet<String>();

		for (int i = 0; i < txt.length(); i++) {

			// 判断是否包含敏感字符
			int length = CheckSensitiveWord(txt, i, matchType);

			// 存在,加入list中
			if (length > 0) {
				sensitiveWordList.add(txt.substring(i, i + length));

				// 减1的原因，是因为for会自增
				i = i + length - 1;
			}
		}

		return sensitiveWordList;
	}

	/**
	 * 替换敏感字字符
	 * 
	 * @param txt
	 * @param matchType
	 * @param replaceChar
	 * @return
	 */
	public String replaceSensitiveWord(String txt, int matchType, String replaceChar) {

		String resultTxt = txt;
		
		// 获取所有的敏感词
		Set<String> set = getSensitiveWord(txt, matchType);
		Iterator<String> iterator = set.iterator();
		String word = null;
		String replaceString = null;
		while (iterator.hasNext()) {
			word = iterator.next();
			//转义特殊字符
			if(word.contains(".")){
				//把字符"."转义为"\."
				word = word.replaceAll("\\.", Matcher.quoteReplacement("\\."));
			}
			if(word.contains("*")){
				//把字符"*"转义为"\*"
				word = word.replaceAll("\\*", Matcher.quoteReplacement("\\*"));
			}
			if(word.contains("$")){
				//把字符"$"转义为"\$"
				word = word.replaceAll("\\$", Matcher.quoteReplacement("\\$"));
			}
			if(word.contains("+")){
				//把字符"+"转义为"\+"
				word = word.replaceAll("\\+", Matcher.quoteReplacement("\\+"));
			}
			if(word.contains("(")){
				//把字符"("转义为"\("
				word = word.replaceAll("\\(", Matcher.quoteReplacement("\\("));
			}
			if(word.contains(")")){
				//把字符")"转义为"\)"
				word = word.replaceAll("\\)", Matcher.quoteReplacement("\\)"));
			}
			//如果包含"\\"字符
			if(word.contains("\\\\")){
				//把字符"\\"转义为"\\\\\\\\"
				word = word.replaceAll(Matcher.quoteReplacement("\\\\"), Matcher.quoteReplacement("\\\\\\\\"));
			}
			System.out.println("word = " + word);
			replaceString = getReplaceChars(replaceChar, word.length());
			resultTxt = resultTxt.replaceAll(word, replaceString);
		}

		return resultTxt;
	}

	/**
	 * 获取替换字符串
	 * 
	 * @param replaceChar
	 * @param length
	 * @return
	 */
	private String getReplaceChars(String replaceChar, int length) {
		String resultReplace = replaceChar;
		for (int i = 1; i < length; i++) {
			resultReplace += replaceChar;
		}

		return resultReplace;
	}

	/**
	 * 检查文字中是否包含敏感字符，检查规则如下：<br>
	 * 如果存在，则返回敏感词字符的长度，不存在返回0
	 * 
	 * @param txt
	 * @param beginIndex
	 * @param matchType
	 * @return
	 */
	public int CheckSensitiveWord(String txt, int beginIndex, int matchType) {

		// 敏感词结束标识位：用于敏感词只有1位的情况
		boolean flag = false;

		// 匹配标识数默认为0
		int matchFlag = 0;
		Map nowMap = sensitiveWordMap;
		for (int i = beginIndex; i < txt.length(); i++) {
			char word = txt.charAt(i);

			// 获取指定key
			nowMap = (Map) nowMap.get(word);

			// 存在，则判断是否为最后一个
			if (nowMap != null) {

				// 找到相应key，匹配标识+1
				matchFlag++;

				// 如果为最后一个匹配规则,结束循环，返回匹配标识数
				if ("1".equals(nowMap.get("isEnd"))) {

					// 结束标志位为true
					flag = true;

					// 最小规则，直接返回,最大规则还需继续查找
					if (SensitivewordFilter.minMatchTYpe == matchType) {
						break;
					}
				}
			// 不存在，直接返回
			}else {
				break;
			}
			
		}

		// 长度必须大于等于1，为词
//		if (matchFlag < 2 || !flag) {
//			matchFlag = 0;
//		}
		//因特殊字符需要, 屏蔽部分单个字符
		if (matchFlag < 1 || !flag) {
			matchFlag = 0;
		}
		return matchFlag;
	}

	public static void main(String[] args) {

//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS");
//
//		SensitivewordFilter filter = SensitivewordFilter.getInstance();
//		/**
//		 * 屏蔽字库
//		 */
//		Set<String> set = SensitiveWordInit.getWordSet();
//		
//		/**
//		 * 未成功处理字库
//		 */
//		Set<String> dishandle = new HashSet<String>();
//		
//		for(String str : set){
//			System.out.println("str = " + str);
//			String resultStr = filter.replaceSensitiveWord(str, SensitivewordFilter.maxMatchType, "*");
//			System.out.println("resultStr = " + resultStr);
//			
//			if(resultStr.equals(str)){
//				dishandle.add(str);
//			}
//
//		}
//
//		for(String content : dishandle){
//			System.out.println("==============未处理的词条==============");
//			System.out.println("=====================================");
//			System.out.println();
//			System.out.println("content = " + content);
//			System.out.println();
//			System.out.println("=================结束=================");
//			System.out.println("=====================================");
//			
//		}
//		
//		System.out.println("size = " + dishandle.size());
		
//		String txt = "有66㈧㈱666雪域烈焰•藏人自焚新疆7.5事件外/挂氵去車侖工力毛外/挂法~倫U-R靠一天U/R靠啦暴徒、昆明火车站啦九•十•三西藏政治犯运动啦啦ＧＡＭＥ　ｍａｓｔｅｒc a oas$hole1000scarf.com*法*轮*功*靠建水大道咚咚咚.arpa.arpa.coop有一天啦啦啦啦（伊斯蘭亞格林尼斯@sshole靠";
//		String regex = "^\\*法\\*轮\\*功\\*靠$";
//		System.out.println("flag = " + txt.matches(regex));
//		System.out.println("result = " + txt.replaceAll("建水大道", "****"));
		//	特殊字符"\\"
//		String txt = "\\\\";
//		System.out.println("是否包含\\字符 = " + txt.contains("\\\\"));
//		String regex = Matcher.quoteReplacement("\\\\");
//		System.out.println("flag = " + txt.matches(regex));
//		String resultTxt = txt.replaceAll(regex, "******");
//		System.out.println("resultTxt = " + resultTxt);
//		String result = filter.replaceSensitiveWord(txt, SensitivewordFilter.maxMatchType, "*");
//		System.out.println("替换前的文字为：" + txt);
//		System.out.println("替换后的文字为：" + result);
		
//		System.out.println(sdf.format(new Date()));
//		String result = filter.replaceSensitiveWord(txt, SensitivewordFilter.maxMatchType, "*");
//		System.out.println(sdf.format(new Date()));
//		System.out.println("替换前的文字为：" + txt);
//		System.out.println("替换后的文字为：" + result);
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp,
			FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) resp;
		DirtyRequest dirtyrequest = new DirtyRequest(request);

		chain.doFilter(dirtyrequest, response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}
	
	class DirtyRequest extends HttpServletRequestWrapper {

		private HttpServletRequest request;
		
		SensitivewordFilter filter = SensitivewordFilter.getInstance();

		public DirtyRequest(HttpServletRequest request) {
			super(request);
			this.request = request;
		}


		@Override
		public String[] getParameterValues(String name) {
			// TODO Auto-generated method stub
			String[] value = super.getParameterValues(name);
			String[] result = null;
			if(value != null && value.length > 0){
				int count = value.length; 
				result = new String[count];
				for (int i = 0; i < count; i++) {
					result[i] = filter.replaceSensitiveWord(value[i],SensitivewordFilter.maxMatchType, "*");
				}
			}
			return result;
		}
	}
}
