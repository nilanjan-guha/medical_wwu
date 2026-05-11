import { moodApi } from "../../api/mood.api";

jest.mock("../../api/mood.api", () => ({
  moodApi: {
    submitCheckin: jest.fn()
  }
}));

describe("mood api usage", () => {
  it("submits checkin payload", async () => {
    (moodApi.submitCheckin as jest.Mock).mockResolvedValue({ ok: true });

    const payload = {
      anxiety: 5,
      fear: 5,
      stress: 5,
      depression: 5,
      sleepQuality: 5,
      motivation: 5,
      painLevel: 5,
      freeText: "feeling low"
    };

    await moodApi.submitCheckin(payload);

    expect(moodApi.submitCheckin).toHaveBeenCalledWith(payload);
  });
});
