import { Request, Response } from "express";
import Book from "../models/book";
import Review from "../models/reviews";

// Kontrollerar att en adress använder http eller https.
function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const createBook = async (req: Request, res: Response) => {
  const { title, description, author, genres, image, published_year } =
    req.body ?? {};

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof author !== "string" ||
    !Array.isArray(genres) ||
    typeof image !== "string" ||
    typeof published_year !== "number"
  ) {
    res.status(400).json({
      message:
        "title, description, author, genres, image and published_year are required",
    });
    return;
  }

  const normalizedTitle = title.trim();
  const normalizedDescription = description.trim();
  const normalizedAuthor = author.trim();
  const normalizedGenres = genres
    .filter((genre): genre is string => typeof genre === "string")
    .map((genre) => genre.trim())
    .filter(Boolean);
  const normalizedImage = image.trim();
  const currentYear = new Date().getFullYear();

  if (!normalizedTitle || normalizedTitle.length > 150) {
    res.status(400).json({
      message: "title must contain between 1 and 150 characters",
    });
    return;
  }

  if (normalizedAuthor.length < 2 || normalizedAuthor.length > 100) {
    res.status(400).json({
      message: "author must contain between 2 and 100 characters",
    });
    return;
  }

  if (
    normalizedDescription.length < 10 ||
    normalizedDescription.length > 2000
  ) {
    res.status(400).json({
      message: "description must contain between 10 and 2000 characters",
    });
    return;
  }

  if (
    normalizedGenres.length === 0 ||
    normalizedGenres.join(",").length > 300
  ) {
    res.status(400).json({
      message: "at least one valid genre is required",
    });
    return;
  }

  if (!isValidHttpUrl(normalizedImage)) {
    res.status(400).json({
      message: "image must be a valid http or https URL",
    });
    return;
  }

  if (
    !Number.isInteger(published_year) ||
    published_year < 0 ||
    published_year > currentYear
  ) {
    res.status(400).json({
      message: `published_year must be an integer between 0 and ${currentYear}`,
    });
    return;
  }

  try {
    const result = await Book.create({
      title: normalizedTitle,
      description: normalizedDescription,
      author: normalizedAuthor,
      genres: normalizedGenres,
      image: normalizedImage,
      published_year,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const result = await Book.find();
    res.status(200).json(result);
  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Book.findById(id).populate("reviews");
    if (!result) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(result);
  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, author, genres, image, published_year } =
    req.body;

  try {
    const result = await Book.updateOne(
      { _id: id },
      { title, description, author, genres, image, published_year },
      { runValidators: true },
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json({ message: "Book updated" });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        message: "Book data is invalid",
      });
      return;
    }

    console.error("Error updating book:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    await Review.deleteMany({ book_id: id });
    res.status(200).json({ message: "Book deleted" });
  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};
