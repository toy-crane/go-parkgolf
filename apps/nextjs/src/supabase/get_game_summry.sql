
CREATE OR REPLACE FUNCTION get_game_summary(input_game_id UUID)
RETURNS TABLE(
  game_player_id UUID,
  player_name TEXT,
  game_course TEXT,
  total_score bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS game_player_id,
    p.nickname AS player_name,
    c.name AS game_course,
    SUM(s.score) AS total_score
  FROM
    games g
    JOIN game_courses c ON g.id = c.game_id
    JOIN game_scores gs ON c.id = gs.game_course_id
    JOIN game_player_scores s ON gs.id = s.game_score_id
    JOIN game_players p ON s.game_player_id = p.id
  WHERE
    g.id = input_game_id  -- Use the parameter with a distinct name
  GROUP BY
    p.id,
    p.nickname,
    c.name
  ORDER BY
    p.id,
    c.name;
END; $$
LANGUAGE plpgsql;