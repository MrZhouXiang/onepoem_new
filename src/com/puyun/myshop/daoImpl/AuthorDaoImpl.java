package com.puyun.myshop.daoImpl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import com.puyun.myshop.dao.AuthorDao;
import com.puyun.myshop.entity.AuthorMod;
import com.puyun.myshop.entity.PoemMod;

/**
 * 作者处理
 */
public class AuthorDaoImpl extends BaseDaoImpl implements AuthorDao
{
    private JdbcTemplate jdbcTemplate;

    private NamedParameterJdbcTemplate namedJdbcTemplate;

    private static final Logger logger = Logger.getLogger(AuthorDaoImpl.class);

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
    public List<AuthorMod> getAuthorList(int id, int size, int page)
    {
        // TODO Auto-generated method stub
        String sql = "select * from author_t";
        List<AuthorMod> list = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<AuthorMod>(AuthorMod.class));
        return list;
    }

    @Override
    public boolean addModel(AuthorMod model)
    {
        String sql1 = "insert into author_t(name,style,dynasty_id,dynasty,introduce,url)"
                + "values(:name,:style,:dynasty_id,:dynasty,:introduce,:url)";
        GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
        int i = this.namedJdbcTemplate.update(sql1,
                new BeanPropertySqlParameterSource(model), generatedKeyHolder);
        return i > 0 ? true : false;
    }

	@Override
	public List<AuthorMod> getAuthorList(String keyword, int start, int num) {
		// TODO Auto-generated method stub
      String key = "%" + keyword + "%";
      String sql = "select * from author_t where name like ? order by id desc"
              + " limit " + start + "," + num;
      List<AuthorMod> list = jdbcTemplate.query(sql, new Object[]
      { key }, new BeanPropertyRowMapper<AuthorMod>(AuthorMod.class));
      return list;
	}

	@Override
	public AuthorMod getAuthor(int id) {
		String sql = "select * from author_t where id = ?";
        List<AuthorMod> list = jdbcTemplate.query(sql, new Object[]
        { id }, new BeanPropertyRowMapper<AuthorMod>(AuthorMod.class));
        return list.get(0);
	}

	@Override
	public boolean updateAuthor(AuthorMod model) {
		// TODO Auto-generated method stub
		String sql = "update author_t set name=:name,style=:style,dynasty_id=:dynasty_id,dynasty=:dynasty,introduce=:introduce,url=:url "
                + "where id=:id";
        GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
        int num = this.namedJdbcTemplate.update(sql,
                new BeanPropertySqlParameterSource(model), generatedKeyHolder);
        return num > 0 ? true : false;
//        return false;
	}

	@Override
	public boolean deleteModel(int id) {
		String sql = "delete from author_t where id = "+id;
        int i = jdbcTemplate.update(sql);
        return i > 0 ? true : false;
	}
}
