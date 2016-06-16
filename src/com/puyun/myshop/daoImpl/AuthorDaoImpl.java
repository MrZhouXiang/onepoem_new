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
    public List<AuthorMod> getAuthorList(int id, int size)
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
        String sql1 = "insert into author_t(name,dynasty_id,dynasty,introduce,url)"
                + "values(:name,:dynasty_id,:dynasty,:introduce,:url)";
        GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
        int i = this.namedJdbcTemplate.update(sql1,
                new BeanPropertySqlParameterSource(model), generatedKeyHolder);
        return i > 0 ? true : false;
    }

}
