using airo_event_simulation_domain.Impl;

namespace airo_event_simulation_tests.Common;

public static class TestMap
{
    public static Map Get() 
    {
        string mapData = @"
        {
          ""size"": 3,
          ""tiles"": [
            {
              ""x"": 0,
              ""y"": 0,
              ""type"": ""spawn""
            },
            {
              ""x"": 2,
              ""y"": 0,
              ""type"": ""water""
            },
            {
              ""x"": 0,
              ""y"": 1,
              ""type"": ""iron""
            },
	        {
              ""x"": 1,
              ""y"": 1,
              ""type"": ""wood""
            },
	        {
              ""x"": 2,
              ""y"": 1,
              ""type"": ""food""
            },
	        {
              ""x"": 0,
              ""y"": 2,
              ""type"": ""wall""
            },
          ]
        }";

        var map = new Map(mapData);

        return map;
    }
}
