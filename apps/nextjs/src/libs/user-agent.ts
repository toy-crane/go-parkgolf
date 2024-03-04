const isApp = (userAgent: string) => {
  const rules = ["(iPhone|iPod|iPad)(?!.*Safari/)", "Android.*(wv|.0.0.0)"];
  const exceptions = ["kakaotalk", "naver"];
  const regex = new RegExp(`(${rules.join("|")})`, "ig");
  const exceptionRegex = new RegExp(`(${exceptions.join("|")})`, "i");

  // userAgent에 예외가 포함되어 있지 않고, 정규 표현식 규칙에 맞는 경우만 isInApp이 true가 됩니다.
  const isApp =
    !userAgent.match(exceptionRegex) && Boolean(userAgent.match(regex));
  return isApp;
};

export { isApp };
