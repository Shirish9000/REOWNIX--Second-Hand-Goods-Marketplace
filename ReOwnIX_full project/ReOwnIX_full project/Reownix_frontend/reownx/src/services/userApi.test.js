import { describe, it, expect, vi, beforeEach } from "vitest";
import userApi from "./userApi";
import authApi from "./authApi";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("userApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    it("returns profile when response contains data.data", async () => {
      const profile = {
        id: 1,
        firstName: "Nikita",
        lastName: "Yawalkar",
        email: "nikita@test.com",
      };

      authApi.get.mockResolvedValue({
        data: {
          data: profile,
        },
      });

      const result = await userApi.getProfile();

      expect(authApi.get).toHaveBeenCalledWith("/users/profile");
      expect(result).toEqual(profile);
    });

    it("returns profile when response contains only data", async () => {
      const profile = {
        id: 2,
        name: "John",
      };

      authApi.get.mockResolvedValue({
        data: profile,
      });

      const result = await userApi.getProfile();

      expect(result).toEqual(profile);
    });
  });

  describe("updateProfile", () => {
    it("updates profile successfully using data.data", async () => {
      const payload = {
        firstName: "Nikita",
        lastName: "Yawalkar",
      };

      authApi.put.mockResolvedValue({
        data: {
          data: payload,
        },
      });

      const result = await userApi.updateProfile(payload);

      expect(authApi.put).toHaveBeenCalledWith(
        "/users/profile",
        payload
      );

      expect(result).toEqual(payload);
    });

    it("updates profile successfully using data", async () => {
      const payload = {
        firstName: "John",
      };

      authApi.put.mockResolvedValue({
        data: payload,
      });

      const result = await userApi.updateProfile(payload);

      expect(result).toEqual(payload);
    });
  });

  describe("changePassword", () => {
    it("changes password successfully", async () => {
      const payload = {
        oldPassword: "old12345",
        newPassword: "new12345",
      };

      const response = {
        success: true,
        message: "Password changed successfully",
      };

      authApi.put.mockResolvedValue({
        data: response,
      });

      const result = await userApi.changePassword(payload);

      expect(authApi.put).toHaveBeenCalledWith(
        "/users/change-password",
        payload
      );

      expect(result).toEqual(response);
    });

    it("returns failure response", async () => {
      const payload = {
        oldPassword: "wrongpass",
        newPassword: "new12345",
      };

      const response = {
        success: false,
        message: "Current password is incorrect",
      };

      authApi.put.mockResolvedValue({
        data: response,
      });

      const result = await userApi.changePassword(payload);

      expect(result).toEqual(response);
    });
  });
});