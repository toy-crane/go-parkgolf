CREATE OR REPLACE FUNCTION insert_courses(data jsonb)
RETURNS void AS $$
DECLARE
    course_data jsonb;
    hole_data jsonb;
    new_course_id uuid;
BEGIN
    -- courses 배열을 반복 처리
    FOR course_data IN SELECT * FROM jsonb_array_elements(data->'courses')
    LOOP
        -- courses 테이블에 데이터 삽입. description이 없는 경우 NULL로 처리
        INSERT INTO courses (golf_course_id, name, description)
        VALUES ((data->>'golf_course_id')::uuid, course_data->>'name', NULL)
        RETURNING id INTO new_course_id;

        -- holes 배열 데이터를 반복 처리
        FOR hole_data IN SELECT * FROM jsonb_array_elements(course_data->'holes')
        LOOP
            -- holes 테이블에 데이터 삽입
            INSERT INTO holes (course_id, hole_number, par, distance)
            VALUES (new_course_id, (hole_data->>'hole_number')::smallint, (hole_data->>'par')::smallint, (hole_data->>'distance')::integer);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
