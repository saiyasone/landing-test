import { useLazyQuery } from "@apollo/client";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import { useEffect } from "react";

const useManageSetting = () => {
  const [getSetting, { data: get_setting }] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  async function customSettings() {
    try {
      await getSetting({
        variables: {
          noLimit: true,
        },
      });
    } catch (error) {
      console.error("Error on Setting", error);
    }
  }

  useEffect(() => {
    customSettings();
  }, []);

  return {
    data: get_setting?.general_settings?.data || [],
  };
};

export default useManageSetting;
