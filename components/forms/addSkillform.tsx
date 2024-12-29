'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const skillFormSchema = z.object({
  name: z.string().min(2, {
    message: "Skill name must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  proficiency_level: z.number().min(1).max(10),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

interface AddSkillFormProps {
  onAddSkill: (skill: any) => void
}

export function AddSkillForm({ onAddSkill }: AddSkillFormProps) {
  const form = useForm<z.infer<typeof skillFormSchema>>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiency_level: 1,
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof skillFormSchema>) {
    onAddSkill({
      ...values,
      skill_id: Date.now().toString(), // Generate a temporary ID
      endorsed_count: 0,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter skill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Enter skill category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="proficiency_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency Level</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[...Array(5)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Level {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your skill" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Skill</Button>
      </form>
    </Form>
  )
}

