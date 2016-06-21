package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import com.puyun.myshop.dao.PoemDao;
import com.puyun.myshop.entity.PoemMod;

/**
 * 诗文处理
 */
public class PoemDaoImpl extends BaseDaoImpl implements PoemDao
{
    private JdbcTemplate jdbcTemplate;

    private NamedParameterJdbcTemplate namedJdbcTemplate;

    private static final Logger logger = Logger.getLogger(PoemDaoImpl.class);

    public JdbcTemplate getJdbcTemplate()
    {
        return this.jdbcTemplate;
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate)
    {
        this.jdbcTemplate = jdbcTemplate;
        this.namedJdbcTemplate = new NamedParameterJdbcTemplate(
                jdbcTemplate.getDataSource());
    }

    @Override
    public List<PoemMod> getPoemList(int id, int size, int page)
    {
        String where = "";
        String sql = "select * from poem_t ";
        String limit = " order by id desc limit " + size + "";
        switch (page)
        {
        case -1:// 刷新
            where = "where id >" + id;
            break;
        case 0:// 首次
            where = "";
            break;
        case 1:// 更多
            where = "where id <" + id;
            break;
        default:
            break;
        }
        sql = sql + where + limit;
        List<PoemMod> list = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
        return list;
    }

    @Override
    public boolean addModel(PoemMod model)
    {
        String sql1 = "insert into poem_t(author_id,author_name,title,content,url)"
                + "values(:author_id,:author_name,:title,:content,:url)";
        GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
        int i = this.namedJdbcTemplate.update(sql1,
                new BeanPropertySqlParameterSource(model), generatedKeyHolder);
        return i > 0 ? true : false;
    }

    @Override
    public List<PoemMod> getPoemList(String keyword, int start, int num)
    {
        String key = "%" + keyword + "%";
        String sql = "select * from poem_t where title like ? order by id desc"
                + " limit " + start + "," + num;
        List<PoemMod> list = jdbcTemplate.query(sql, new Object[]
        { key }, new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
        return list;
    }

    @Override
    public PoemMod getPoem(int id)
    {
        String sql = "select * from poem_t where id = ?";
        List<PoemMod> list = jdbcTemplate.query(sql, new Object[]
        { id }, new BeanPropertyRowMapper<PoemMod>(PoemMod.class));
        return list.get(0);
    }

    @Override
    public boolean updateModel(PoemMod model)
    {
        String sql = "update poem_t set author_name=:author_name,author_id=:author_id,title=:title,content=:content,url=:url "
                + "where id=:id";
        GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
        int num = this.namedJdbcTemplate.update(sql,
                new BeanPropertySqlParameterSource(model), generatedKeyHolder);
        return num > 0 ? true : false;
    }

	@Override
	public boolean deleteModel(int id) {
		String sql = "delete from poem_t where id = "+id;
        int i = jdbcTemplate.update(sql);
        return i > 0 ? true : false;
	}
}
