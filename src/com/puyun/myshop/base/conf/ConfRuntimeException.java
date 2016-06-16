package com.puyun.myshop.base.conf;

import com.iuvei.framework.exception.ZeroRuntimeException;

public class ConfRuntimeException extends ZeroRuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ConfRuntimeException(String message) {
		super(message);
	}

	public ConfRuntimeException(String message, Throwable cause) {
		super(message, cause);
	}

}
