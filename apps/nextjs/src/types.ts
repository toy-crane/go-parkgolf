export interface Location {
  id: number;
  name: string;
  address: {
    address_name: string;
    b_code: string;
    h_code: string;
    main_address_no: string;
    mountain_yn: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_h_name: string;
    region_3depth_name: string;
    sub_address_no: string;
    x: string;
    y: string;
  };
  road_address?: {
    address_name: string;
    building_name: string;
    main_building_no: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    sub_building_no: string;
    underground_yn: string;
    x: string;
    y: string;
    zone_no: string;
  };
  hole_count: string;
  contact: {
    phone_number?: string;
  };
  operation: {
    opening_hours?: string;
    regular_closed_days?: string;
    website?: string;
    registration_method?: string;
  };
}
