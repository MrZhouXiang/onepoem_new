package com.puyun.myshop.base.util;

import org.htmlparser.Node;
import org.htmlparser.Parser;
import org.htmlparser.util.NodeIterator;
import org.htmlparser.visitors.TextExtractingVisitor;
public class Html2Text {
    
    /**
     * 把HTML中的文本提取出来，如果会保留HTML中的换行
     * @param html HTML内容
     * @return 解析出来的纯文本
     * @see [类、类#方法、类#成员]
     */
    public  static String html2Text(String html){   
        if(html == null){
            return "";
        }
        
        StringBuffer text = new StringBuffer();
        try
        {
            Parser parser = Parser.createParser(html, "UTF-8");
            for (NodeIterator i = parser.elements(); i.hasMoreNodes();)
            {
                Node node = i.nextNode();
                text.append(node.toPlainTextString());
            }
        }
        catch (Exception e)
        {
            System.out.println("Exception:" + e);
        }
        return text.toString();
    }      
    
    /**
     * 把HTML中的文本提取出来，无格式没有换行
     * @param html HTML内容
     * @return 解析出来的纯文本
     * @see [类、类#方法、类#成员]
     */
    public  static String html2TextNoFormat(String html){    
        if(html == null){
            return "";
        }
        
        StringBuffer text = new StringBuffer();
        try
        {
            Parser parser = Parser.createParser(html, "UTF-8");
            TextExtractingVisitor visitor = new TextExtractingVisitor();
            parser.visitAllNodesWith(visitor);
            String textInPage = visitor.getExtractedText();
            text.append(textInPage);
        }
        catch (Exception e)
        {
            System.out.println("Exception:" + e);
        }
        return text.toString();
    }      
    
    public static void main(String[] args)
    {
        String html ="届中央委员会通常要召开七次全体会议，即“一中全会”到“七中全会”。</p><p><strong>深化“三中全会”部署</strong></p><p>“一中全会”一般紧接着党的代表大会之后召开，聚焦“人事”，讨论、选举党的领导；“二中全会”一般在全国两会之前召开，主题也以“人事”为主，讨论新一届国家机构的人事安排；“三中全会”则以“经济与改革”为主题，改革开放以来历届三中全会的决策部署，对中国发展产生了深远影响。</p><p>而“四中全会”，一般与“三中全会”相隔一年左右，会期一般4天，会议内容通常全面落实、深化“三中全会”的决策部署。</p><p>8个月前的十八届三中全会，提出“建设法治中国，必须坚持依法治国、依法执政、依法行政共同推进，坚持法治国家、法治政府、法治社会一体建设”。<strong>今年10月将召开的十八届四中全会，将研究全面推进依法治国重大问题。</strong></p>";
        
        long start = System.currentTimeMillis();
        for (int i = 0; i < 200; i++)
        {
            html2Text(html);
        }
        
        System.out.println(System.currentTimeMillis() - start);
    }
}