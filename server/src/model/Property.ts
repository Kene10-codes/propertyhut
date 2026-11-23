import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  owner: Types.ObjectId;
  propertyType: string;
  listingType: string;
  price: number;
  currency: string;
  paymentFrequency: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  area?: number;
  areaUnit?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  amenities: string[];
  images: {
    url: string;
    publicId?: string;
  }[];
  status: string;
  availability: string;
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyType: {
      type: String,
      enum: [
        "apartment",
        "duplex",
        "bungalow",
        "self_contain",
        "studio",
        "terrace",
        "detached_house",
        "commercial",
        "other",
      ],
      required: true,
    },
    listingType: {
      type: String,
      enum: ["rent", "sell", "shortlet"],
      default: "rent",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    paymentFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly", "one_time"],
      default: "yearly",
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    toilets: {
      type: Number,
      default: 0,
      min: 0,
    },
    area: Number,
    areaUnit: {
      type: String,
      enum: ["sqm", "sqft"],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Nigeria",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    amenities: [String],
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected", "archived"],
      default: "pending",
    },
    availability: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true },
);

propertySchema.index({ location: "2dsphere" });
propertySchema.index({ city: 1, state: 1, propertyType: 1 });
propertySchema.index({ price: 1, bedrooms: 1, status: 1 });

export const Property = mongoose.model<IProperty>("Property", propertySchema);
