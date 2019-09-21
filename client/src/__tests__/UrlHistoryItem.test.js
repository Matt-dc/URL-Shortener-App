import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import UrlHistoryItem from "../components/UrlHistoryItem";

configure({ adapter: new Adapter() });

describe("<UrlHistoryItem />", () => {
  it("Should check component mounts", () => {
    const wrapper = shallow(
      <UrlHistoryItem url={{ longUrl: "http://some-random.url" }} />
    );
  });
});
