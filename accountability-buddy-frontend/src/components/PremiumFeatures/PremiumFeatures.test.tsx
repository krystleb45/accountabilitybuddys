import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PremiumFeatureA from "./PremiumFeatureA";
import PremiumFeatureB from "./PremiumFeatureB";
import PremiumFeatureC from "./PremiumFeatureC";
import PremiumFeaturePricing from "./PremiumFeaturePricing";
import { expect } from "@jest/globals";

describe("Premium Features", () => {
  describe("PremiumFeatureA", () => {
    it("renders correctly and toggles activation", () => {
      const onActivate = jest.fn();
      const onDeactivate = jest.fn();

      const { rerender } = render(
        <PremiumFeatureA
          title="Feature A"
          description="Description of Feature A"
          isActive={false}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      );

      expect(screen.getByText("Feature A")).toBeInTheDocument();
      expect(screen.getByText("Activate")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Activate"));
      expect(onActivate).toHaveBeenCalled();

      rerender(
        <PremiumFeatureA
          title="Feature A"
          description="Description of Feature A"
          isActive={true}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      );

      expect(screen.getByText("Deactivate")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Deactivate"));
      expect(onDeactivate).toHaveBeenCalled();
    });
  });

  describe("PremiumFeatureB", () => {
    it("renders correctly and toggles enablement", () => {
      const onEnable = jest.fn();
      const onDisable = jest.fn();

      const { rerender } = render(
        <PremiumFeatureB
          featureName="Feature B"
          details="Details of Feature B"
          enabled={false}
          onEnable={onEnable}
          onDisable={onDisable}
        />
      );

      expect(screen.getByText("Feature B")).toBeInTheDocument();
      expect(screen.getByText("Enable")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Enable"));
      expect(onEnable).toHaveBeenCalled();

      rerender(
        <PremiumFeatureB
          featureName="Feature B"
          details="Details of Feature B"
          enabled={true}
          onEnable={onEnable}
          onDisable={onDisable}
        />
      );

      expect(screen.getByText("Disable")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Disable"));
      expect(onDisable).toHaveBeenCalled();
    });
  });

  describe("PremiumFeatureC", () => {
    it("renders correctly and toggles state", () => {
      const onToggle = jest.fn();

      render(
        <PremiumFeatureC
          heading="Feature C"
          description="Description of Feature C"
          active={false}
          onToggle={onToggle}
        />
      );

      expect(screen.getByText("Feature C")).toBeInTheDocument();
      expect(screen.getByText("Activate")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Activate"));
      expect(onToggle).toHaveBeenCalled();
    });
  });

  describe("PremiumFeaturePricing", () => {
    it("renders pricing plans and handles subscriptions", () => {
      const onSubscribe = jest.fn();

      const plans = [
        {
          name: "Basic",
          price: "$5/month",
          features: ["Feature 1", "Feature 2"],
        },
        {
          name: "Pro",
          price: "$15/month",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          isRecommended: true,
        },
      ];

      render(<PremiumFeaturePricing plans={plans} onSubscribe={onSubscribe} />);

      expect(screen.getByText("Basic")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
      expect(screen.getByText("$5/month")).toBeInTheDocument();
      expect(screen.getByText("$15/month")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Subscribe", { selector: "button" }));
      expect(onSubscribe).toHaveBeenCalledWith("Basic");
    });
  });
});
