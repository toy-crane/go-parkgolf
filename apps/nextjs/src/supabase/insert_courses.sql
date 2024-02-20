CREATE OR REPLACE FUNCTION insert_courses(golf_data jsonb)
RETURNS void AS $$
DECLARE
    course_data jsonb;
    hole_data jsonb;
    new_course_id uuid;
BEGIN
    -- courses 배열을 반복 처리
    FOR course_data IN SELECT * FROM jsonb_array_elements(golf_data->'courses')
    LOOP
        -- courses 테이블에 데이터 삽입. description이 없는 경우 NULL로 처리
        INSERT INTO courses (golf_course_id, name, description)
        VALUES ((golf_data->>'golf_course_id')::uuid, course_data->>'name', course_data->>'description')
        RETURNING id INTO new_course_id;

        -- holes 데이터 추출
        hole_data := course_data->'holes';

        -- holes 테이블에 데이터 삽입
        INSERT INTO holes (course_id, hole_number, par, distance)
        VALUES (new_course_id, (hole_data->>'hole_number')::smallint, (hole_data->>'par')::smallint, (hole_data->>'distance')::integer);
    END LOOP;
END;
$$ LANGUAGE plpgsql;